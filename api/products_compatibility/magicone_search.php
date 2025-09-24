<?php
// ProductSearchInterfaceを読み込む
require_once './products_compatibility/product_search_interface.php';

class MagiconeMakerSearch implements ProductSearchInterface
{
    private $product;
    private $maker;
    private $model;
    private $userDateTimestamp;

    public function __construct($product, $maker, $model, $year, $month)
    {
        $this->product = $product;
        $this->maker = $maker;
        $this->model = $model;
        $this->userDateTimestamp = strtotime("{$year}-{$month}-01");
    }

    public function getSql(): string
    {
        switch($this->product) {
            case 'magicone_bk_un':
                return "SELECT * FROM magicone_bk_un_maker WHERE maker = ? AND car_model LIKE ?";
                break;
            case 'magicone_bk_ha':
                return "SELECT * FROM magicone_bk_ha_maker WHERE maker = ? AND car_model LIKE ?";
                break;
                //ika temp
            case 'magicone_bk_un':
                return "SELECT * FROM magicone_bk_un_maker WHERE maker = ? AND car_model LIKE ?";
                break;
            case 'magicone_bk_ha':
                return "SELECT * FROM magicone_bk_un_maker WHERE maker = ? AND car_model LIKE ?";
                break;
            case 'magicone_bk_vtr':
                return "SELECT * FROM magicone_bk_un_maker WHERE maker = ? AND car_model LIKE ?";
                break;
        }
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


class MagiconeDealerSearch implements ProductSearchInterface
{
    private $product;
    private $maker;
    private $productCode;

    public function __construct($product, $maker, $productCode)
    {
        $this->product = $product;
        $this->maker = $maker;
        $this->productCode = $productCode;
    }

    public function getSql(): string
    {
        switch($this->product) {
            case 'magicone_bk_un':
                return "SELECT * FROM magicone_bk_un_dealer WHERE maker = ? AND monitor_number LIKE ?";
                break;
            case 'magicone_bk_ha':
                return "SELECT * FROM magicone_bk_ha_dealer WHERE maker = ? AND monitor_number LIKE ?";
                break;
                //ika temp
            case 'magicone_bk_un':
                return "SELECT * FROM magicone_bk_un_dealer WHERE maker = ? AND monitor_number LIKE ?";
                break;
            case 'magicone_bk_ha':
                return "SELECT * FROM magicone_bk_un_dealer WHERE maker = ? AND monitor_number LIKE ?";
                break;
            case 'magicone_bk_vtr':
                return "SELECT * FROM magicone_bk_un_dealer WHERE maker = ? AND monitor_number LIKE ?";
                break;
        }
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