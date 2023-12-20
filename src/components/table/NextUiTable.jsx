import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Tooltip,
  Modal,
  useDisclosure,
} from "@nextui-org/react";
import { PlusIcon } from "../../assets/PlusIcon";
import { SearchIcon } from "../../assets/SearchIcon";
import { ChevronDownIcon } from "../../assets/ChevronDownIcon";
import { columns } from "../../data/data";
import { capitalize } from "../../utils/utils";
import { EditIcon } from "../../assets/EditIcon";
import { EyeIcon } from "../../assets/EyeIcon";
import { DeleteIcon } from "../../assets/DeleteIcon";
import { Toaster, toast } from "react-hot-toast";
import { CustomModalBody } from "./CustomModalBody";
import { pb } from "../../services/pocketbase";
import { fetchExpensesData } from "../../services/ExpensesService";

const INITIAL_VISIBLE_COLUMNS = ["causal", "amount", "actions"];

export default function NextUiTable() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [categories, setCategories] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [modalContent, setModalContent] = React.useState({});
  const [modalType, setModalType] = React.useState("detail");
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "amount",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const [rows, setRows] = React.useState([]);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);
  var pages = 0;

  useEffect(() => {}, [pages, rows]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the API call to fetch the row data
        const res = await fetchExpensesData();
        setCategories(res[0]);
        setRows(res[1]);
      } catch (error) {
        // Handle the error
        console.error("Failed to fetch row data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredItems = React.useMemo(() => {
    console.log("update");
    let filteredUsers = [...rows];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.causal.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [rows.length, filterValue, rows]);

  pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (expense, columnKey) => {
      const cellValue = expense[columnKey];
      console.log("update");
      switch (columnKey) {
        case "amount":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue} €</p>
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Details" color="primary">
                <span
                  className="text-lg text-primary cursor-pointer active:opacity-50"
                  onClick={() => handleInfoCell(expense)}
                >
                  <EyeIcon color />
                </span>
              </Tooltip>
              <Tooltip content="Edit user">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => handleDeleteRow(expense.id)}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [rows.length, rows]
  );

  const handleInfoCell = (item) => {
    setModalType("detail");
    setModalContent(item);
    onOpen();
  };

  const handleInsertExpens = () => {
    setModalType("insert");
    // setModalContent(item);
    onOpen();
  };

  const toastInsertRecord = (status) => {
    if (status === "success") {
      toast.success("Spesa inserita con successo", {
        style: { marginBottom: "12vh" },
      });
    } else {
      toast.error("Errore in creazione spesa", {
        style: { marginBottom: "12vh" },
      });
    }
  };

  const handleDeleteRow = async (id) => {
    setModalContent({});
    try {
      await pb.collection("expenses").delete(id);
      toast.success("Eliminazione effettuata con successo", {
        style: { marginBottom: "12vh" },
      });

      const newRows = rows.filter((row) => row.id !== id);
      console.log(newRows);
      setRows(newRows);
      console.log(rows);
    } catch (error) {
      toast.error("Errore durante l' eliminazione, riprovare piu tardi", {
        style: { marginBottom: "12vh" },
      });
    }
  };

  const handleInsertRow = (item) => {
    var updatedRows = rows;
    const category = categories.find((element) => element.id === item.category);

    const data = new Date(item.date);
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

    const newData = {
      id: item.id,
      collectionId: item.collectionId,
      collectionName: item.collectionName,
      created: item.created,
      updated: item.updated,
      causal: item.causal,
      amount: item.amount,
      notes: item.notes,
      category: category?.name || "",
      date: dataFormattata,
    };

    updatedRows.push(newData);
    console.log(updatedRows);
    setRows(updatedRows);
    console.log(rows);
  };

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    console.log("update");
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-center">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown></Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              endContent={<PlusIcon />}
              onPress={handleInsertExpens}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {rows.length} expenses
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    rows.length,
    onSearchChange,
    rows,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <div className="p-5">
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No expanses found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="2xl"
      >
        <CustomModalBody
          handleInsertRow={handleInsertRow}
          toastInsertRecord={toastInsertRecord}
          categories={categories}
          modalContent={modalContent}
          modalType={modalType}
          onClose={onclose}
        />
      </Modal>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
