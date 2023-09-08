import { Card, Text } from "@shopify/polaris";

const HomePage = ({ homePageAssets, handleSelect, selectedAsset }) => {
  return homePageAssets?.map((asset) => (
    <div
      key={asset.key}
      onClick={() => handleSelect(asset)}
      style={{
        cursor: "pointer",
        border: selectedAsset &&  selectedAsset.key === asset.key ? '1px solid dark'  : 'none'
      }}
    >
      <Card key={asset.key} padding={{ xs: "2" }}>
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

export default HomePage;
