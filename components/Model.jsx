import { Card, Modal, Text } from "@shopify/polaris";
import React from "react";

const Model = ({ setIsModalOpen, isModalOpen, modelData }) => {
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      title="New Created Template Information"
    >
      <Modal.Section>
        <Card padding={{ xs: "2" }}>
          <Text as="p" color="subdued">
            Asset Key : {modelData.createdAssest.asset.key}
          </Text>
          <Text as="p" color="subdued">
            Theme ID : {modelData.createdAssest.asset.theme_id}
          </Text>
          <Text as="p" color="subdued">
            Crated At : {modelData.createdAssest.asset.created_at}
          </Text>
          <Text as="p" color="subdued">
            Updated At : {modelData.createdAssest.asset.updated_at}
          </Text>
        </Card>
      </Modal.Section>
    </Modal>
  );
};

export default Model;
