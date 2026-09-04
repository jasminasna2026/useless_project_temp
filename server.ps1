$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8085/")
$listener.Start()
Write-Host "HTTP Server listening on http://localhost:8085/"

$folder = "C:\Users\SANGEERTH KARAYI\.gemini\antigravity\scratch\toss-the-unsure"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relPath = $request.Url.LocalPath
        if ($relPath -eq "/") { $relPath = "/index.html" }
        $filePath = $folder + $relPath.Replace('/', '\')

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            if ($ext -eq ".html") { $response.ContentType = "text/html" }
            elseif ($ext -eq ".css") { $response.ContentType = "text/css" }
            elseif ($ext -eq ".js") { $response.ContentType = "application/javascript" }

            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.OutputStream.Close()
        } else {
            $response.StatusCode = 404
            $response.OutputStream.Close()
        }
    } catch {
        # continue loop
    }
}
