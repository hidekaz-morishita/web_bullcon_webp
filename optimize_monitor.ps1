$targetDir = 'c:\Users\taku-\workspace\web_bullcon\html\products\MONITER'
$files = Get-ChildItem -Path $targetDir -Filter *.htm -Recurse
$spacerDataUri = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        $newContent = $content
        
        # 1. Apply loading="lazy" to images that don't have it
        $newContent = $newContent -replace '<img((?![^>]*loading=)[^>]+)>', '<img$1 loading="lazy">'
        
        # 2. Replace spacer.gif with Data URI
        $newContent = $newContent -replace 'src="([^"]*spacer\.gif)"', ('src="' + $spacerDataUri + '"')
        
        if ($content -ne $newContent) {
            Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
            Write-Host "Optimized: $($file.FullName)"
        }
    } catch {
        Write-Error "Failed to process $($file.FullName): $($_.Exception.Message)"
    }
}
Write-Host "Optimization for MONITOR directory complete."
