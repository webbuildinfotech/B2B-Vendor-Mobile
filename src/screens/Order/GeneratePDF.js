import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import { PDFDocument, rgb } from 'react-native-pdf-lib';
import { writeFile, DocumentDirectoryPath } from 'react-native-fs';

const GeneratePDF = ({ orderProducts, address }) => {
  const [pdfPath, setPdfPath] = useState('');

  const generatePdf = async () => {
    try {
      const page = PDFDocument.create().addPage();
      
      // Add Address
      page.drawText('Address:', { x: 20, y: 700, fontSize: 18, color: rgb(0, 0, 0) });
      page.drawText(`Street Address: ${address.streetAddress}`, { x: 20, y: 670, fontSize: 14 });
      page.drawText(`State: ${address.state}`, { x: 20, y: 650, fontSize: 14 });
      page.drawText(`Country: ${address.country}`, { x: 20, y: 630, fontSize: 14 });
      page.drawText(`Zip Code: ${address.zipCode}`, { x: 20, y: 610, fontSize: 14 });
      page.drawText(`Phone: ${address.phoneNumber}`, { x: 20, y: 590, fontSize: 14 });

      // Add Order Products
      page.drawText('Order Products:', { x: 20, y: 560, fontSize: 18 });
      
      orderProducts.forEach((product, index) => {
        const yPosition = 540 - index * 50;
        page.drawText(`Product Name: ${product.ProductName}`, { x: 20, y: yPosition, fontSize: 14 });
        page.drawText(`Group: ${product.group}`, { x: 20, y: yPosition - 20, fontSize: 14 });
        page.drawText(`SubGroup 1: ${product.subGroup1}`, { x: 20, y: yPosition - 40, fontSize: 14 });
        page.drawText(`SubGroup 2: ${product.subGroup2}`, { x: 20, y: yPosition - 60, fontSize: 14 });
        page.drawText(`Price: ${product.SellingPrice}`, { x: 20, y: yPosition - 80, fontSize: 14 });
        page.drawText(`Quantity: ${product.Quantity}`, { x: 20, y: yPosition - 100, fontSize: 14 });
      });

      const pdfPath = `${DocumentDirectoryPath}/order_confirmation.pdf`;
      const pdfBytes = await page.save();
      await writeFile(pdfPath, pdfBytes);
      setPdfPath(pdfPath);
    } catch (error) {
      console.error("Error generating PDF: ", error);
    }
  };

  return (
    <View>
      <Button title="Generate PDF" onPress={generatePdf} />
      {pdfPath ? <Text>PDF saved at: {pdfPath}</Text> : null}
    </View>
  );
};

export default GeneratePDF;
