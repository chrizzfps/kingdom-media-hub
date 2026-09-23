<?php
/**
 * Lead intake for the static site (replaces the Next.js /api/contact route,
 * which can't exist in a static export). Mirrors lib/validations.ts.
 *
 * Secrets live OUTSIDE the web root, next to public_html:
 *   domains/kingdommediahub.com/kingdom-config.php
 *     <?php return [
 *       'resend_api_key' => 're_...',
 *       'to'   => 'hello@kingdommediahub.com',
 *       'from' => 'Kingdom Media Hub <noreply@kingdommediahub.com>',
 *     ];
 * Every lead is also appended to domains/kingdommediahub.com/kingdom-leads.log,
 * so nothing is lost if email isn't configured or Resend is down.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): void {
    http_response_code($status);
    echo json_encode($body);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'method_not_allowed']);
}

$raw = file_get_contents('php://input', false, null, 0, 20000);
$data = json_decode($raw ?: '', true);
if (!is_array($data)) {
    respond(400, ['error' => 'invalid_json']);
}

$str = fn(string $k): string => is_string($data[$k] ?? null) ? trim($data[$k]) : '';
$len = fn(string $v): int => mb_strlen($v, 'UTF-8');

$lead = [
    'name'        => $str('name'),
    'company'     => $str('company'),
    'industry'    => $str('industry'),
    'revenue'     => $str('revenue'),
    'email'       => $str('email'),
    'phone'       => $str('phone'),
    'projectType' => $str('projectType'),
    'message'     => $str('message'),
];

$revenueBands = ['under-10k', '10k-50k', '50k-250k', '250k-plus'];
$projectTypes = ['ai-voice-agents', 'automation', 'website', 'content-production', 'training', 'full-ecosystem'];

$errors = [];
if ($len($lead['name']) < 2 || $len($lead['name']) > 80) $errors[] = 'name';
if ($len($lead['company']) < 1 || $len($lead['company']) > 120) $errors[] = 'company';
if ($len($lead['industry']) < 2 || $len($lead['industry']) > 80) $errors[] = 'industry';
if (!in_array($lead['revenue'], $revenueBands, true)) $errors[] = 'revenue';
if (!filter_var($lead['email'], FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if ($len($lead['phone']) < 6 || $len($lead['phone']) > 30) $errors[] = 'phone';
if (!in_array($lead['projectType'], $projectTypes, true)) $errors[] = 'projectType';
if ($len($lead['message']) > 1000) $errors[] = 'message';
if ($errors) {
    respond(422, ['error' => 'validation', 'fields' => $errors]);
}

$privateDir = dirname(__DIR__, 2);

@file_put_contents(
    $privateDir . '/kingdom-leads.log',
    json_encode(['at' => gmdate('c')] + $lead, JSON_UNESCAPED_UNICODE) . PHP_EOL,
    FILE_APPEND | LOCK_EX
);

$configFile = $privateDir . '/kingdom-config.php';
$config = is_file($configFile) ? require $configFile : [];
$apiKey = $config['resend_api_key'] ?? '';

if ($apiKey === '') {
    respond(200, ['ok' => true, 'delivered' => false]);
}

$payload = [
    'from'     => $config['from'] ?? 'Kingdom Media Hub <noreply@kingdommediahub.com>',
    'to'       => [$config['to'] ?? 'hello@kingdommediahub.com'],
    'reply_to' => $lead['email'],
    'subject'  => "New lead — {$lead['company']} ({$lead['projectType']})",
    'text'     => implode("\n", [
        "Name: {$lead['name']}",
        "Company: {$lead['company']}",
        "Industry: {$lead['industry']}",
        "Monthly revenue: {$lead['revenue']}",
        "Email: {$lead['email']}",
        "Phone: {$lead['phone']}",
        "Project type: {$lead['projectType']}",
        'Message: ' . ($lead['message'] !== '' ? $lead['message'] : '—'),
    ]),
];

$ch = curl_init('https://api.resend.com/emails');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $apiKey, 'Content-Type: application/json'],
    CURLOPT_POSTFIELDS     => json_encode($payload),
]);
curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
curl_close($ch);

if ($status < 200 || $status >= 300) {
    // The lead is already in kingdom-leads.log.
    respond(502, ['error' => 'send_failed']);
}

respond(200, ['ok' => true, 'delivered' => true]);
