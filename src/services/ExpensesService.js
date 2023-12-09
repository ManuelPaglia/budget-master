import { pb } from "../services/pocketbase";

export async function fetchExpensesData() {
  try {
    const records2 = await pb.collection("categories").getFullList(200, {
      sort: "-created",
      requestKey: null,
    });

    const records1 = await pb.collection("expenses").getFullList(200, {
      sort: "-created",
      requestKey: null,
    });

    const tempExpenses = records1.map((element) => {
      const category = records2.find((item) => item.id === element.category);
      const data = new Date(element.date);
      const giorno = data.getDate();
      const mese = data.getMonth() + 1;
      const anno = data.getFullYear();
      const dataFormattata =
        (giorno < 10 ? "0" : "") +
        giorno +
        "-" +
        (mese < 10 ? "0" : "") +
        mese +
        "-" +
        anno;

      return {
        id: element.id,
        collectionId: element.collectionId,
        collectionName: element.collectionName,
        created: element.created,
        updated: element.updated,
        causal: element.causal,
        amount: element.amount,
        notes: element.notes,
        category: category?.name || "",
        date: dataFormattata,
      };
    });

    return tempExpenses;
  } catch (error) {
    console.error("Failed to fetch expenses data:", error);
    throw error;
  }
}