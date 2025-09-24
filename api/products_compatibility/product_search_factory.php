<?php
// 処理クラスを読み込む
require_once './products_compatibility/televing_search.php';
require_once './products_compatibility/magicone_search.php';

class ProductSearchFactory
{
    public static function create($product, $option, array $params)
    {
        switch ($product) {
            case 'televing':
                if ($option === 'maker') {
                    return new TelevingMakerSearch(
                        $params['maker'], 
                        $params['model'], 
                        $params['year'], 
                        $params['month']
                    );
                } elseif ($option === 'dealer') {
                    return new TelevingDealerSearch(
                        $params['maker'], 
                        $params['productCode']
                    );
                }
                break;
            case 'magicone_bk_un':
            case 'magicone_bk_ha':
                if ($option === 'maker') {
                    return new MagiconeMakerSearch(
                        $product,
                        $params['maker'], 
                        $params['model'], 
                        $params['year'], 
                        $params['month']
                    );
                } elseif ($option === 'dealer') {
                    return new MagiconeDealerSearch(
                        $product,
                        $params['maker'], 
                        $params['productCode']
                    );
                }
                break;
        }
        throw new Exception('無効な製品名またはオプションタイプです。');
    }
}