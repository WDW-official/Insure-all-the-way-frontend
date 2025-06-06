import ExcelJS from "exceljs";

export const readExcelFile = async (
  file: File,
  setState: any,
  setTrueState: any
) => {
  const reader = new FileReader();

  reader.onload = async (event: ProgressEvent<FileReader>) => {
    const buffer = event.target?.result;
    if (!buffer) return;

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);

    const worksheet = workbook.worksheets[0];
    const jsonData: Record<string, any>[] = [];

    let headers: string[] = [];

    worksheet.eachRow((row, rowNumber) => {
      const rowValues = (row?.values as any)?.slice(1);

      if (rowNumber === 1) {
        headers = rowValues.map((header: any) => {
          return typeof header === "object" && header?.richText
            ? header.richText.map((part: any) => part.text).join("")
            : String(header ?? "").trim();
        });
      } else {
        const rowObject: Record<string, any> = {};

        headers.forEach((key, index) => {
          const cell = rowValues[index];

          let value: any = "";
          if (typeof cell === "object" && cell?.richText) {
            value = cell.richText.map((part: any) => part.text).join("");
          } else if (typeof cell === "object" && cell?.text) {
            value = cell.text;
          } else {
            value = cell ?? "";
          }

          rowObject[key] = value;
        });

        jsonData.push(rowObject);
      }
    });

    setState(jsonData as any);
  };

  reader.readAsArrayBuffer(file);
  setTrueState(true);
};
