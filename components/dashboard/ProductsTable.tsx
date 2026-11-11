'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AddProductButton from "./AddProductButton"
import ProductForm from "./Form"
import TablePager from "./TablePager"
import { formatMoney } from "./orderStatusMeta"
import { getErrorMessage, useAdminProducts, useDeleteProduct } from "@/hooks/useAdmin"
import { useDebounce } from "@/hooks/useDebounce"
import { Item } from "@/types/ItemTypes"

const LOW_STOCK = 5

export default function ProductsTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 300)
  const { data, isLoading, error, isPlaceholderData } = useAdminProducts(page, debouncedSearch)

  const products = data?.products ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold md:text-3xl">Products</h1>
        <AddProductButton />
      </div>

      <Card>
        <CardContent className="px-4 sm:px-6">
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              aria-label="Search products"
              placeholder="Search by title or description"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <RowsSkeleton />
          ) : error ? (
            <p className="py-8 text-center text-sm text-destructive">
              Couldn&apos;t load products. Refresh the page to try again.
            </p>
          ) : products.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-medium">
                {debouncedSearch ? `No products match "${debouncedSearch}"` : "No products yet"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {debouncedSearch ? "Try a shorter or different search." : "Add your first product to start selling."}
              </p>
            </div>
          ) : (
            <div className={isPlaceholderData ? "opacity-60 transition-opacity" : "transition-opacity"}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden text-right sm:table-cell">Price</TableHead>
                    <TableHead className="hidden text-right sm:table-cell">Variants</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="w-12">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {data?.pagination && products.length > 0 && (
            <TablePager
              page={data.pagination.currentPage}
              totalPages={data.pagination.totalPages}
              totalCount={data.pagination.totalCount}
              noun="product"
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ProductRow({ product }: { product: Item }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const deleteProduct = useDeleteProduct()

  const variants = product.variants ?? []
  const stock = variants.reduce((sum, variant) => sum + variant.stock, 0)
  const soldOutVariants = variants.filter((variant) => variant.stock === 0).length
  const onSale = product.isOnSale && product.salePrice != null

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(product.id)
      toast.success(`${product.title} deleted`)
      setDeleteOpen(false)
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't delete this product. Try again."))
    }
  }

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          {product.imgSrc?.[0] ? (
            <Image
              src={product.imgSrc[0]}
              alt=""
              width={48}
              height={48}
              className="size-10 shrink-0 rounded-md object-cover object-top sm:size-12"
            />
          ) : (
            <span className="size-10 shrink-0 rounded-md bg-muted sm:size-12" aria-hidden />
          )}
          <div className="min-w-0">
            <p className="max-w-[27vw] truncate font-medium sm:max-w-56">{product.title}</p>
            <p className="text-xs text-muted-foreground tabular-nums sm:hidden">
              {formatMoney(onSale ? product.salePrice! : product.price)}
            </p>
            <p className="hidden text-xs text-muted-foreground capitalize sm:block md:hidden">{product.category}</p>
            {product.isOnSale && (
              <Badge variant="secondary" className="mt-1">
                On sale
              </Badge>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <p>{product.category}</p>
        <p className="text-xs text-muted-foreground capitalize">{product.gender}</p>
      </TableCell>
      <TableCell className="hidden text-right tabular-nums sm:table-cell">
        {onSale ? (
          <>
            <p className="font-medium">{formatMoney(product.salePrice!)}</p>
            <p className="text-xs text-muted-foreground line-through">{formatMoney(product.price)}</p>
          </>
        ) : (
          <p className="font-medium">{formatMoney(product.price)}</p>
        )}
      </TableCell>
      <TableCell className="hidden text-right tabular-nums sm:table-cell">{variants.length}</TableCell>
      <TableCell className="text-right tabular-nums">
        <p className={stock === 0 ? "font-medium text-destructive" : "font-medium"}>
          {stock === 0 ? "Sold out" : stock.toLocaleString()}
        </p>
        {stock > 0 && soldOutVariants > 0 ? (
          <p className="text-xs text-muted-foreground">{soldOutVariants} sold out</p>
        ) : stock > 0 && stock <= LOW_STOCK ? (
          <p className="text-xs text-muted-foreground">Running low</p>
        ) : null}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={`Actions for ${product.title}`}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setEditOpen(true)}>
              <Pencil /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/products/${product.id}`}>
                <ExternalLink /> View in store
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-h-[80vh] overflow-y-auto lg:max-h-[90vh] lg:min-w-[100vh]">
            <DialogTitle>Edit {product.title}</DialogTitle>
            <ProductForm isEdit product={product} onSuccess={() => setEditOpen(false)} />
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {product.title}?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes the product and its {variants.length} variant{variants.length === 1 ? "" : "s"} from
                the store. It can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep product</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                disabled={deleteProduct.isPending}
                onClick={(event) => {
                  event.preventDefault()
                  handleDelete()
                }}
              >
                {deleteProduct.isPending ? "Deleting..." : "Delete product"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  )
}

export function RowsSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  )
}
