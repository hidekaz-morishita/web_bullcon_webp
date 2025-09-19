<?php
// 処理クラスを読み込む
require_once './products_compatibility/televing_search.php';

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
            // 将来、新しい製品が追加された場合はここにcaseを追加
            // case 'new_product': ...
        }
        throw new Exception('無効な製品名またはオプションタイプです。');
    }
}