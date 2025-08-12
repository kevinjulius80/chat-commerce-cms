<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Prometheus\CollectorRegistry;
use Prometheus\RenderTextFormat;

class PrometheusService
{
    const NAMESPACE = 'cms';
    public $renderer;
    protected $adapter;
    private $collectorRegistry;

    public function __construct()
    {
        Log::debug("Constructing Prometheus Service");

//        $this->adapter = new InMemory();
//        $this->adapter->wipeStorage();
//        $this->collectorRegistry = new CollectorRegistry($this->adapter);
        $this->collectorRegistry = CollectorRegistry::getDefault();
        $this->renderer = new RenderTextFormat();
    }

    public function increment(string $path, string $method)
    {
        try {
            $counter = $this->collectorRegistry->getOrRegisterCounter(self::NAMESPACE, 'http_requests_total', 'The total number of requests.', [
                'path',
                'method',
            ]);
            $counter->inc([$path, $method]);
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function getMetrics()
    {
        $renderer = $this->renderer;
        $result = $renderer->render($this->collectorRegistry->getMetricFamilySamples());
        header('Content-type: ' . RenderTextFormat::MIME_TYPE);
        return $result;
    }
}
