<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    @viteReactRefresh
    @vite('resources/css/app.css')
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Registration</title>
</head>
<body>
    <div id="app"></div>
    
    @vite('resources/js/app.js')
</body>
</html>
