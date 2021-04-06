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

  userList.forEach(({ uploadedImages: images = [], data, title }, i) => {
    doc.setFontSize(14)
    let x = 25, y = 35;
    // const imageDimensions = imageDimensionsOnA4({
    //   width: image.width,
    //   height: image.height,
    // });

    doc.addPage();
    const body = [
      { name: 'Apellidos y Nombres', value: data.lastName },
      { name: 'DNI', value: data.documentNumber },
      { name: 'Alias', value: data.nickname },
      { name: 'Banda', value: data.organization },
      { name: 'Delito', value: data.crime },
      { name: 'Modalidad', value: data.modality },
      { name: 'Fecha y Hora de intervención', value: data.interventionDate },
      { name: 'Lugar de los hechos', value: data.place },
      { name: 'Características físicas', value: data.character },
      { name: 'Señales particulares', value: data.signals },
    ]


    // doc.text(x, 20, `ALBUM FOTOGRAFICO DETENIDOS`)
    let splitTitle = doc.splitTextToSize(`${title}`, 100);
    doc.text(splitTitle, A4_PAPER_DIMENSIONS.width / 2, 15, 'center');
    doc.setFontSize(10)
    body.forEach((item, index) => {
      doc.text(`${item.name.toUpperCase()}`, x, y)
      doc.text(':', x + 65, y)
      let splitValue = doc.splitTextToSize(item.value, 80);
      doc.text(splitValue, x + 75, y)
      y += 9
    })

    x = 35

    images.forEach((image, index) => {
      if (index !== 0 && index % 2 === 0) {
        y += 80;
      }

      const imageDimensions = imageDimensionsOnA4({
        width: image.width,
        height: image.height,
      });

      doc.addImage(
        image.src,
        image.imageType,
        // (A4_PAPER_DIMENSIONS.width - imageDimensions.width) / 2,
        x + (index % 2 === 0 ? 0 : 80),
        y,
        // (A4_PAPER_DIMENSIONS.height - imageDimensions.height) / 2,
        imageDimensions.width / 4,
        imageDimensions.height / 4
      );
    })

    doc.text('Página ' + String(i + 1) + ' de ' + String(userList.length), 210 - 20, 297 - 10, null, null, "right");
  });

  const pdfURL = doc.output("bloburl");
  window.open(pdfURL, "_blank");
};