import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  VerticalStack,
  Card,
  Button,
  Box,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import PageTabs from "../../components/PageTabs";
import Model from "components/Model";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;
  const apiAccessToken = session.accessToken;

  const apiEndpoint = `/admin/api/2023-07/themes/144035676467/assets.json`;

  // Make a GET request using admin.rest.get()
  const response = await admin.rest.get({
    path: apiEndpoint,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch assets: ${response.status} - ${response.statusText}`
    );
  }
  const assetsData = await response.json();

  const assets = assetsData.assets;
  return json({
    data: { assets, shop, apiAccessToken, session },
  });
};

export let action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const stringData = await request.text();
  const params = new URLSearchParams(stringData);

  // Get the values of the specific parameters
  const selectedAssetKey = params.get("selectedAssetKey");
  const selectedAssetThemeId = params.get("selectedAssetThemeId");

  // check when gett selectAssetKey and selectedAsseThemeId
  if (selectedAssetKey && selectedAssetThemeId) {
    const apiEndpoint = `/admin/api/2023-07/themes/${selectedAssetThemeId}/assets.json?asset%5Bkey%5D=${encodeURIComponent(
      selectedAssetKey
    )}`;

    // Hit admin rest api for get assets list
    const response = await admin.rest.get({
      path: apiEndpoint,
    });
    const assetData = await response.json();

    // Generate Data for duplicate new template
    const newTemplateRandomName = generateRandomName(selectedAssetKey);
    const currentTemplateContent = assetData.asset.value;

    // create New assets
    const createdAssest = await createNewAsset({
      newTemplateRandomName,
      currentTemplateContent,
      selectedAssetKey,
      selectedAssetThemeId,
      session,
    });
    // console.log(await duplicatedTemplateResponse.json());
    return json({ status: "success", createdAssest });
    //create rendom number to
  } else {
    return json({ status: "success" });
  }
};

// Fuction for create New assets
async function createNewAsset(data) {
  const apiEndpoint = `https://${data.session.shop}/admin/api/2023-01/themes/${data.selectedAssetThemeId}/assets.json`;
  var myHeaders = new Headers();
  myHeaders.append("X-Shopify-Access-Token", data.session.accessToken);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    asset: {
      key: `templates/${data.newTemplateRandomName}`,
      value: data.currentTemplateContent,
    },
  });
  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(apiEndpoint, requestOptions);

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData; // Return the parsed JSON response
  } catch (error) {
    throw new Error(`API request error: ${error.message}`);
  }
}
// Function for prepare New name of template
function generateRandomName(selectedAssetKey) {
  const parts = selectedAssetKey.split("/");
  const lastPart = parts[parts.length - 1];
  const [templateName, templateExtention] = lastPart.split(".");
  const randomKey = generateRandomKey(10);
  const newName = `${templateName}.${randomKey}.liquid`;
  return newName;
}

function generateRandomKey(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomKey = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomKey += characters.charAt(randomIndex);
  }

  return randomKey;
}

export default function Index() {
  const { data } = useLoaderData();
  const actionData = useActionData();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const submit = useSubmit();
  const handleSelect = (asset) => {
    setSelectedAsset(asset);
    console.log('Selected Asset:', asset);
  };

  const handleDuplicate = (event) => {
    event.preventDefault();
    // Check if a selected asset exists
    if (selectedAsset) {
      submit(event.currentTarget, { method: "POST" });
    }
  };

  useEffect(() => {
    // Check if actionData has data, and open the modal if true
    if (actionData) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [actionData]);
  
  return (
    <Page>
      <ui-title-bar title="Remix app template"></ui-title-bar>
      <VerticalStack gap="5">
        <Layout>
          <Layout.Section>
            {/* TODO: Render the Tabs and Panels components here */}
            <PageTabs assets={data.assets} handleSelect={handleSelect} selectedAsset={selectedAsset} />
            {isModalOpen && actionData && (
              <Model setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} modelData={actionData} />
            )}
          </Layout.Section>
        </Layout>
        <form method="post" onSubmit={handleDuplicate}>
          <input
            type="hidden"
            name="selectedAssetKey"
            value={selectedAsset ? selectedAsset.key : ""}
          />
          <input
            type="hidden"
            name="selectedAssetThemeId"
            value={selectedAsset ? selectedAsset.theme_id : ""}
          />
          <Button submit primary disabled={!selectedAsset}>
            Duplicate Template
          </Button>
        </form>
      </VerticalStack>
    </Page>
  );
}
