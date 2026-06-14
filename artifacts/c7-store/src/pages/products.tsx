import React, { useState } from "react";
import productsHeroImg from "@/assets/images/products-hero.png";
import { useListCategories, useListProducts } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Input } from "@/components/ui/input";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: categories } = useListCategories();
  const { data: products, isLoading } = useListProducts({ 
    categoryId: selectedCategory,
    search: searchQuery || null
  });
  
  const { addItem } = useCart();

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
          <p className="text-xl max-w-2xl mx-auto font-medium text-zinc-100">
            Quality products, local favorites, and everyday essentials available 24/7.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 flex-1 bg-zinc-50">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col md:flex-row gap-8 mb-8 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              <Button 
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="rounded-full font-semibold"
              >
                All Products
              </Button>
              {categories?.map((cat) => (
                <Button 
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="rounded-full font-semibold whitespace-nowrap"
                >
                  {cat.name}
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64 flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-9 rounded-full bg-white border-zinc-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-64 bg-zinc-200 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full bg-white">
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
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-zinc-800 text-white font-bold px-3 py-1 rounded text-sm">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1 line-clamp-1">{product.categoryName}</p>
                      <h3 className="font-bold text-sm md:text-base mb-2 line-clamp-2 leading-tight">{product.name}</h3>
                    </div>
                    <div className="mt-4">
                      <p className="font-bold text-primary text-lg md:text-xl mb-3">₱{product.price.toFixed(2)}</p>
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
              <p className="text-muted-foreground">Try adjusting your category filter or search query.</p>
              <Button variant="outline" className="mt-6" onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
