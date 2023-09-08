import { Card, Text } from "@shopify/polaris";

const ProductPage = ({ productPageAssets, handleSelect , selectedAsset }) => {
  return productPageAssets?.map((asset) => (
    <div
      key={asset.key}
      onClick={() => handleSelect(asset)}
      style={{ cursor: "pointer" }}
    >
      <Card padding={{ xs: "2" }}>
        <Text as="p" color="subdued">
          Asset Key : {asset.key}
        </Text>
        <Text as="p" color="subdued">
          Theme ID : {asset.theme_id}
        </Text>
        <Text as="p" color="subdued">
          Updated At : {asset.updated_at}
        </Text>
      </Card>
    </div>
  ));
};

export default ProductPage;
