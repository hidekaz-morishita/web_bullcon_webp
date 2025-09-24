<?php
// ProductSearchInterfaceを読み込む
require_once './products_compatibility/product_search_interface.php';

class MagiconeUnMakerSearch implements ProductSearchInterface
{
    private $maker;
    private $model;
    private $userDateTimestamp;

    public function __construct($maker, $model, $year, $month)
    {
        $this->maker = $maker;
        $this->model = $model;
        $this->userDateTimestamp = strtotime("{$year}-{$month}-01");
    }

    public function getSql(): string
    {
        return "SELECT * FROM magicone_bk_un_maker WHERE maker = ? AND car_model LIKE ?";
    }

    public function getParams(): array
    {
        return [$this->maker, "{$this->model}%"];
    }

    public function postProcess(array $data): array
    {
        if ($this->userDateTimestamp === false) {
            return [];
        }

        $filteredData = [];
        foreach ($data as $item) {
            $startDate = $item['start_date'] ?? '';
            $endDate = $item['end_date'] ?? '';

            if ($this->isDateMatch($startDate, $endDate)) {
                $filteredData[] = $item;
            }
        }
        return $filteredData;
    }

    private function isDateMatch($startDateString, $endDateString): bool
    {
        $startDate = $startDateString ? strtotime($startDateString) : false;
        $endDate = $endDateString ? strtotime("last day of {$endDateString}") : false;

        if ($startDate && $endDate) {
            return $this->userDateTimestamp >= $startDate && $this->userDateTimestamp <= $endDate;
        }
        if ($startDate) {
            return $this->userDateTimestamp >= $startDate;
        }
        if ($endDate) {
            return $this->userDateTimestamp <= $endDate;
        }
        return false;
    }
}


class MagiconeUnDealerSearch implements ProductSearchInterface
{
    private $maker;
    private $productCode;

    public function __construct($maker, $productCode)
    {
        $this->maker = $maker;
        $this->productCode = $productCode;
    }

    public function getSql(): string
    {
        return "SELECT * FROM magicone_bk_un_dealer WHERE maker = ? AND monitor_number LIKE ?";
    }

    public function getParams(): array
    {
        return [$this->maker, "{$this->productCode}%"];
    }

    public function postProcess(array $data): array
    {
        // ディーラーオプションの場合はフィルタリング不要
        return $data;
    }
}