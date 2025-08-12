<?php

namespace App\Http\Controllers;

use App\Services\PrometheusService;

class PrometheusController extends Controller
{
    public function metrics()
    {
        $prometheusService = app(PrometheusService::class);
        return $prometheusService->getMetrics();
    }
}
