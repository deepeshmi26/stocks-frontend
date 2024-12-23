import CardMenu from '@/components/card/CardMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Value } from '@radix-ui/react-select';
import {
  PaginationState,
  createColumnHelper,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';
import React, { useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

type RowObj = {
  checked?: string;
  email: string;
  provider: string;
  created: string;
  lastsigned: string;
  uuid: string;
  menu?: string;
};

function CheckTable(props: { tableData: any }) {
  const { tableData } = props;
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  let defaultData = tableData;
  const [globalFilter, setGlobalFilter] = React.useState('');
  const createPages = (count: number) => {
    let arrPageCount = [];

    for (let i = 1; i <= count; i++) {
      arrPageCount.push(i);
    }

    return arrPageCount;
  };
  const columns = [
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Company
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-medium text-zinc-950 dark:text-white">
          {info.getValue()}
        </p>
      )
    }),
    columnHelper.accessor('recommendedFlag', {
      id: 'recommendedFlag',
      header: () => (
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Recommenation
        </p>
      ),
      cell: (info: any) => (
        <div className="flex w-full items-center gap-[14px]">
          <p className="text-sm font-medium text-zinc-950 dark:text-white">
            {info.getValue()}
          </p>
        </div>
      )
    }),
    columnHelper.accessor('averageReturns', {
      id: 'averageReturns',
      header: () => (
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Average Returns
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-medium text-zinc-950 dark:text-white">
          {info.getValue()}
        </p>
      )
    }),
    columnHelper.accessor('cmp', {
      id: 'cmp',
      header: () => (
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Current Market Price
        </p>
      ),
      cell: (info: any) => (
        <div className="flex w-full items-center gap-[14px]">
          <p className="text-sm font-medium text-zinc-950 dark:text-white">
            {info.getValue()}
          </p>
        </div>
      )
    }),
    columnHelper.accessor('targetPriceRange', {
      id: 'tgtPrice',
      header: () => (
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Target price range
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-medium text-zinc-950 dark:text-white">
          {info.getValue().min}-{info.getValue().max}
        </p>
      )
    }),

    columnHelper.accessor('organizations', {
      id: 'orgsCount',
      header: () => (
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Orgs count
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-medium text-zinc-950 dark:text-white">
          {Object.keys(info.getValue()).length}
        </p>
      )
    }),

    columnHelper.accessor('organizations', {
      id: 'organizations',
      header: () => (
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Orgs
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-medium text-zinc-950 dark:text-white">
          {JSON.stringify(info.getValue())}
        </p>
      )
    })
  ]; // eslint-disable-next-line4

  const [data, setData] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch('http://localhost:3001/get-json').then(
        (response) => response.json()
      );
      const transformedData = Object.entries(data).map(([key, value]) => {
        return {
          ...value,
          name: key
        };
      });
      setData(transformedData);
    };
    fetchData();
  }, []);

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 30
    });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize
    }),
    [pageIndex, pageSize]
  );
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      pagination
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false
  });

  return (
    <Card
      className={
        'h-full w-full border-zinc-200 p-0 dark:border-zinc-800 sm:overflow-auto'
      }
    >
      <div className="overflow-x-scroll xl:overflow-x-hidden">
        <Table className="w-full">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableHeader
              key={headerGroup.id}
              className="border-b-[1px] border-zinc-200 p-6 dark:border-zinc-800"
            >
              <tr className="dark:border-zinc-800">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-zinc-200 pl-5 pr-4 pt-2 text-start dark:border-zinc-800"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: '',
                        desc: ''
                      }[header.column.getIsSorted() as string] ?? null}
                    </TableHead>
                  );
                })}{' '}
              </tr>
            </TableHeader>
          ))}
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow key={row.id} className="px-6 dark:hover:bg-gray-900">
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className="w-max border-b-[1px] border-zinc-200 py-5 pl-5 pr-4 dark:border-white/10"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {/* pagination */}
        <div className="mt-2 flex h-20 w-full items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={`flex items-center justify-center rounded-lg bg-transparent p-2 text-lg text-zinc-950 transition duration-200 hover:bg-transparent active:bg-transparent dark:text-white dark:hover:bg-transparent dark:active:bg-transparent`}
            >
              <MdChevronLeft />
            </Button>

            {/* {createPages(table.getPageCount()).map((pageNumber, index) => {
       return (
        <Button
         className={`font-mediumflex p-0 items-center justify-center rounded-lg p-2 text-sm transition duration-200 ${
          pageNumber === pageIndex + 1
           ? ''
           : 'border border-zinc-200 bg-[transparent] dark:border-zinc-800 dark:text-white'
         }`}
         onClick={() => table.setPageIndex(pageNumber - 1)}
         key={index}
        >
         {pageNumber}
        </Button>
       );
      })} */}
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`flex min-w-[34px] items-center justify-center rounded-lg bg-transparent p-2 text-lg text-zinc-950 transition duration-200 hover:bg-transparent active:bg-transparent dark:text-white dark:hover:bg-transparent dark:active:bg-transparent`}
            >
              <MdChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CheckTable;
const columnHelper = createColumnHelper<RowObj>();
