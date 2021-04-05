import jsPDF from "jspdf";

const A4_PAPER_DIMENSIONS = {
  width: 210,
  height: 297,
};

const CustomImage = (pImg) => {
  let image = new Image()
  image.mimeType = pImg.type
  image.imageType = () => {
    return this.mimeType.split("/")[1]
  }

  return image
}

const A4_PAPER_RATIO = A4_PAPER_DIMENSIONS.width / A4_PAPER_DIMENSIONS.height;

export const imageDimensionsOnA4 = (dimensions) => {
  const isLandscapeImage = dimensions.width >= dimensions.height;

  if (isLandscapeImage) {
    return {
      width: A4_PAPER_DIMENSIONS.width,
      height:
        A4_PAPER_DIMENSIONS.width / (dimensions.width / dimensions.height),
    };
  }

  const imageRatio = dimensions.width / dimensions.height;
  if (imageRatio > A4_PAPER_RATIO) {
    const imageScaleFactor =
      (A4_PAPER_RATIO * dimensions.height) / dimensions.width;

    const scaledImageHeight = A4_PAPER_DIMENSIONS.height * imageScaleFactor;

    return {
      height: scaledImageHeight,
      width: scaledImageHeight * imageRatio,
    };
  }

  return {
    width: A4_PAPER_DIMENSIONS.height / (dimensions.height / dimensions.width),
    height: A4_PAPER_DIMENSIONS.height,
  };
};

export const fileToImageURL = (file) => {
  return new Promise((resolve, reject) => {
    const image = new CustomImage(file);
    image.onload = function () {
      resolve(image);
    };

    image.onerror = () => {
      reject(new Error("Failed to convert File to Image"));
    };

    image.src = URL.createObjectURL(file);
  });
};

export const generatePdfFromImages = (userList) => {
  const doc = new jsPDF();
  doc.deletePage(1);

  userList.forEach(({ uploadedImages: images = [], data }, i) => {
    doc.setFontSize(14)
    let x = 20, y = 45;
    // const imageDimensions = imageDimensionsOnA4({
    //   width: image.width,
    //   height: image.height,
    // });

    doc.addPage();
    const body = [
      { name: 'Apellidos y Nombres', value: data.lastName },
      { name: 'Alias', value: data.nickname },
      { name: 'Fecha y Hora intervención', value: data.interventionDate },
      { name: 'Delito', value: data.crime },
      { name: 'Modalidad', value: data.modality },
    ]
    // doc.text(x, 20, `ALBUM FOTOGRAFICO DETENIDOS`)
    let splitTitle = doc.splitTextToSize('ALBÚM FOTOGRÁFICO DETENIDOS', 80);
    doc.text(splitTitle, A4_PAPER_DIMENSIONS.width / 2, 20, 'center');
    doc.setFontSize(12)
    body.forEach((item, index) => {
      doc.text(`${item.name.toUpperCase()}`, x, y)
      doc.text(':', x + 80, y)
      let splitValue = doc.splitTextToSize(item.value, 80);
      doc.text(splitValue, x + 90, y)
      y += 12
    })

    images.forEach((image, index) => {
      if (index !== 0 && index % 2 === 0) {
        y += 70;
      }

      const imageDimensions = imageDimensionsOnA4({
        width: image.width,
        height: image.height,
      });

      console.log(image)
      doc.addImage(
        image.src,
        image.imageType,
        // (A4_PAPER_DIMENSIONS.width - imageDimensions.width) / 2,
        x + (index % 2 === 0 ? 0 : 90),
        y + 20,
        // (A4_PAPER_DIMENSIONS.height - imageDimensions.height) / 2,
        imageDimensions.width / 2.5,
        imageDimensions.height / 2.5
      );
    })

    doc.text('Página ' + String(i + 1) + ' de ' + String(userList.length), 210 - 20, 297 - 20, null, null, "right");
  });

  const pdfURL = doc.output("bloburl");
  window.open(pdfURL, "_blank");
};