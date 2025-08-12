<?php

namespace App\Http\Middleware;

use App\Services\PrometheusService;
use Closure;

class PrometheusMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $prometheusService = app(PrometheusService::class);
        $prometheusService->increment($request->path(), $request->method());
        return $next($request);
    }
}
