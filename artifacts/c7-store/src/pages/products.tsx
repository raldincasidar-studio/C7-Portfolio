import React, { useState, useMemo } from "react";
import productsHeroImg from "@/assets/images/products-hero.png";
import { useListCategories, useListProducts } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Input } from "@/components/ui/input";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories } = useListCategories();
  const { data: allProducts, isLoading } = useListProducts();

  const { addItem } = useCart();

  const products = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter((p) => {
      const matchesCategory =
        selectedCategory === null || p.categoryId === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, selectedCategory, searchQuery]);

  const hasFilters = selectedCategory !== null || searchQuery !== "";

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src={productsHeroImg}
            alt="C7 Store Products"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4 tracking-tight text-white drop-shadow-lg">
            Fully Stocked for Your Daily Needs
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto font-medium text-zinc-100">
            Quality products, local favorites, and everyday essentials available 24/7.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12 flex-1 bg-zinc-50">
        <div className="container mx-auto px-4">
          {/* Filters Row */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9 pr-10 rounded-full bg-white border-zinc-200 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="rounded-full font-semibold text-sm h-9"
              >
                All Products
                {selectedCategory === null && allProducts && (
                  <span className="ml-1.5 bg-white/20 rounded-full px-1.5 py-0.5 text-xs">
                    {allProducts.length}
                  </span>
                )}
              </Button>
              {categories?.map((cat) => {
                const count = allProducts?.filter((p) => p.categoryId === cat.id).length ?? 0;
                return (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="rounded-full font-semibold text-sm h-9 whitespace-nowrap"
                  >
                    {cat.name}
                    <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${selectedCategory === cat.id ? "bg-white/20" : "bg-zinc-100"}`}>
                      {count}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Results count */}
          {!isLoading && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {hasFilters
                  ? `${products.length} result${products.length !== 1 ? "s" : ""} found`
                  : `${products.length} products`}
              </p>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-primary"
                  onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
                >
                  <X className="h-3 w-3 mr-1" /> Clear filters
                </Button>
              )}
            </div>
          )}

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-72 bg-zinc-200 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full bg-white"
                >
                  <div className="aspect-square bg-white relative overflow-hidden p-4 border-b">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-50 rounded-lg">
                        <ShoppingBag className="h-12 w-12 text-zinc-300" />
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-zinc-800 text-white font-bold px-3 py-1 rounded text-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1 line-clamp-1">
                        {product.categoryName}
                      </p>
                      <h3 className="font-bold text-sm md:text-base mb-2 line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                    </div>
                    <div className="mt-3">
                      <p className="font-bold text-primary text-lg mb-3">
                        ₱{product.price.toFixed(2)}
                      </p>
                      <Button
                        className="w-full font-bold shadow-sm"
                        disabled={!product.inStock}
                        onClick={() => addItem(product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-zinc-100">
              <ShoppingBag className="h-16 w-16 text-zinc-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your category filter or search query.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
