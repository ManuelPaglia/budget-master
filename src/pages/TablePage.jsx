import React, { useEffect, useState } from "react";
import NextUiTable from "../components/table/NextUiTable";
import { pb } from "../services/pocketbase";

export default function TablePage() {
  const [expenses, setExpanses] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // fetchdata();
  }, []);

  async function fetchdata() {
    try {
      const records2 = await pb
        .collection("categories")
        .getFullList(200 /* batch size */, {
          sort: "-created",
        });

      setCategories(records2);

      const records1 = await pb
        .collection("expenses")
        .getFullList(200 /* batch size */, {
          sort: "-created",
        });

      var tempExpanses = [];

      for (const element of records1) {
        const category = records2.filter(
          (item) => item.id === element.category
        );
        var data = new Date(element.date);

        var giorno = data.getDate();
        var mese = data.getMonth() + 1;
        var anno = data.getFullYear();

        var dataFormattata =
          (giorno < 10 ? "0" : "") +
          giorno +
          "-" +
          (mese < 10 ? "0" : "") +
          mese +
          "-" +
          anno;

        tempExpanses.push({
          id: element.id,
          collectionId: element.collectionId,
          collectionName: element.collectionName,
          created: element.created,
          updated: element.updated,
          causal: element.causal,
          amount: element.amount,
          notes: element.notes,
          category: category[0].name,
          date: dataFormattata,
        });
      }
      // console.log(tempExpanses)
      console.log(records1);
      setExpanses(tempExpanses);
      // setExpanses(records1);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <NextUiTable />
    </>
  );
}
