import { LegacyCard, Tabs } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import HomePage from "./home-pages/HomePage";
import CollectionPages from "./collection-pages/CollectionPages";
import ProductPage from "./product-pages/ProductPage";

export default function PageTabs({ assets, handleSelect, selectedAsset }) {
  const [homePageAssets, setHomePageAssets] = useState(null);
  const [collectionPageAssets, setCollectionPageAssets] = useState(null);
  const [productPageAssets, setProductPageAssets] = useState(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const homeAssets = assets.filter(
      (asset) => asset.key === "templates/index.json"
    );
    const collectionAssets = assets.filter(
      (asset) => asset.key.includes("collection") && asset.key.includes(".json")
    );
    const productAssets = assets.filter(
      (asset) => asset.key.includes("product") && asset.key.includes(".json")
    );
    setHomePageAssets(homeAssets);
    setCollectionPageAssets(collectionAssets);
    setProductPageAssets(productAssets);
  }, [assets]);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "home-page",
      content: "Home Pages",
      accessibilityLabel: "All customers",
      panelID: "all-customers-content",
    },
    {
      id: "collection-pages",
      content: "Collection Pages",
      panelID: "collection-pages-content",
    },
    {
      id: "product-pages",
      content: "Product Pages",
      panelID: "rproduct-pages-content",
    },
  ];

  return (
    <LegacyCard>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <LegacyCard.Section title={tabs[selected].content}>
          {selected === 0 && homePageAssets && (
            <HomePage
              homePageAssets={homePageAssets}
              handleSelect={handleSelect}
              selectedAsset={selectedAsset}
            />
          )}
          {selected === 1 && collectionPageAssets && (
            <CollectionPages
              collectionPageAssets={collectionPageAssets}
              handleSelect={handleSelect}
              selectedAsset={selectedAsset}
            />
          )}
          {selected === 2 && productPageAssets && (
            <ProductPage
              productPageAssets={productPageAssets}
              handleSelect={handleSelect}
              selectedAsset={selectedAsset}
            />
          )}
        </LegacyCard.Section>
      </Tabs>
    </LegacyCard>
  );
}
