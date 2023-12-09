import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, SelectItem, Select } from "@nextui-org/react";

export const CustomModalBody = ({ onClose, modalType, modalContent, categories }) => {
  return (
    <ModalContent>
      {(onClsose) => (
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
                />
                <Input
                  isRequired
                  label="Importo"
                  placeholder="Inserisci un importo"
                  type="number"
                />
                <Select
                  isRequired
                  label="Tipo di spesa"
                  placeholder="Scegli il tipo di spesa"
                >
                  {categories.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>
              </>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Elimina
            </Button>
            <Button color="primary" onPress={onClose}>
              Salva
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  );
};
