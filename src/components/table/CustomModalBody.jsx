import {
  Button,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  SelectItem,
  Select,
  Textarea,
} from "@nextui-org/react";
import React, { useState } from "react";
import { pb } from "../../services/pocketbase";

export const CustomModalBody = ({
  onClose,
  handleInsertRow,
  modalType,
  toastInsertRecord,
  modalContent,
  categories,
}) => {
  let currentdate = new Date().toJSON();
  const [date, setDate] = useState(currentdate.slice(0, 10));
  const [causale, setCausale] = useState("");
  const [importo, setImporto] = useState(0);
  const [categoria, setCategoria] = useState("");
  const [note, setNote] = useState("");

  async function onSubmit() {}
console.log(currentdate)
  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="flex flex-col gap-1">
            {modalType === "detail"
              ? modalContent.causal
              : modalType === "insert"
              ? "Inserisci nuova spesa"
              : "Aggiorna spesa: " + modalContent.causal}
          </ModalHeader>
          <ModalBody>
            {modalType === "detail" ? (
              <>
                <p>{modalContent.date}</p>
                <p>{modalContent.amount}</p>
                <p>{modalContent.category}</p>
                <p>{modalContent.notes}</p>
              </>
            ) : modalType === "insert" ? (
              <>
                <Input
                  isRequired
                  label="Causale"
                  placeholder="Inserisci la causale"
                  type="text"
                  onChange={(e) => setCausale(e.target.value)}
                />
                <Input
                  isRequired
                  label="Importo"
                  placeholder="Inserisci un importo"
                  type="number"
                  onChange={(e) => setImporto(e.target.value)}
                />
                <Select
                  isRequired
                  label="Tipo di spesa"
                  placeholder="Scegli il tipo di spesa"
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  {categories.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  isRequired
                  label="Data"
                  placeholder="Data della spesa"
                  type="text"
                  onChange={(e) => {
                    
                    
                    setDate(e.target.value);
                      
                 
                  }}
                  value={date}
                />
                <Textarea
                  label="Note"
                  placeholder="Inserisci note"
                  onChange={(e) => setNote(e.target.value)}
                />
              </>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Chiudi
            </Button>
            {modalType === "insert" ? (
              <Button
                color="primary"
                onPress={async () => {
                  let newDate = currentdate;
                  try {
                      newDate = new Date(date).toJSON();
                  } catch (error) {
                    newDate = currentdate;
                  }
                 
                  const data = {
                    causal: causale,
                    amount: importo,
                    notes: note,
                    category: categoria,
                    date: newDate,
                  };
                  try {
                    const record = await pb.collection("expenses").create(data);
                    console.log(record)
                    handleInsertRow(record);
                    onClose();
                    toastInsertRecord("success");
                  } catch (error) {
                    onClose();
                    toastInsertRecord("error");
                    console.log(error);
                  }
                }}
                isDisabled={
                  causale === "" ||
                  categoria === "" ||
                  importo === 0 ||
                  date.length < 10
                }
              >
                Salva
              </Button>
            ) : null}
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};
