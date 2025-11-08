"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingCart, Search, Star, Plus, Minus, X, Check } from "lucide-react";

// Types
interface Vendor {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  category: string;
  distance: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

// Mock data
const mockVendors: Vendor[] = [
  { id: "1", name: "Fresh Market", rating: 4.7, deliveryTime: "20-30 min", deliveryFee: 2.99, category: "Grocery", distance: "0.8 km" },
  { id: "2", name: "Organic Corner", rating: 4.9, deliveryTime: "25-35 min", deliveryFee: 3.49, category: "Organic", distance: "1.2 km" },
  { id: "3", name: "Pharma Plus", rating: 4.5, deliveryTime: "15-25 min", deliveryFee: 1.99, category: "Pharmacy", distance: "0.5 km" },
  { id: "4", name: "Bakery Delight", rating: 4.8, deliveryTime: "30-40 min", deliveryFee: 2.49, category: "Bakery", distance: "1.5 km" },
  { id: "5", name: "Meat Masters", rating: 4.6, deliveryTime: "35-45 min", deliveryFee: 3.99, category: "Butcher", distance: "2.1 km" },
  { id: "6", name: "Seafood Express", rating: 4.4, deliveryTime: "40-50 min", deliveryFee: 4.99, category: "Seafood", distance: "2.8 km" }
];

const mockProducts: Product[] = [
  { id: "p1", name: "Organic Apples", price: 3.99, description: "Fresh organic apples from local farms", category: "Fruits" },
  { id: "p2", name: "Whole Wheat Bread", price: 2.49, description: "Freshly baked whole wheat bread", category: "Bakery" },
  { id: "p3", name: "Free Range Eggs", price: 4.99, description: "Dozen free range eggs", category: "Dairy" },
  { id: "p4", name: "Organic Milk", price: 3.49, description: "1L organic whole milk", category: "Dairy" },
  { id: "p5", name: "Chicken Breast", price: 8.99, description: "1lb boneless chicken breast", category: "Meat" },
  { id: "p6", name: "Salmon Fillet", price: 12.99, description: "Fresh Atlantic salmon fillet", category: "Seafood" }
];

const categories = ["All", "Grocery", "Organic", "Pharmacy", "Bakery", "Butcher", "Seafood"];

export default function GroceryDeliveryApp() {
  const [vendors] = useState<Vendor[]>(mockVendors);
  const [products] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [address, setAddress] = useState({ street: "", city: "", zip: "", notes: "" });

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = selectedVendor?.deliveryFee || 0;
  const total = cartTotal + deliveryFee;

  useEffect(() => { if (selectedVendor) setCart([]); }, [selectedVendor]);
  useEffect(() => { if (!isCartOpen) setCheckoutStep(0); }, [isCartOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-green-600 w-8 h-8 rounded-full"></div>
            <h1 className="text-xl font-bold text-green-600">6amGrocery</h1>
          </div>
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input type="text" placeholder="Search vendors or products..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <Button variant="ghost" className="relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {!selectedVendor ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Find Local Vendors</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => (
                  <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)}>{category}</Button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map(vendor => (
                  <Card key={vendor.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedVendor(vendor)}>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-semibold">{vendor.name}</h3>
                            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{vendor.distance}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm ml-1">{vendor.rating}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-sm">{vendor.deliveryTime}</span>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm text-gray-600">{vendor.category}</span>
                            <span className="text-sm font-medium">${vendor.deliveryFee.toFixed(2)} delivery</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <Button variant="ghost" className="mb-4" onClick={() => setSelectedVendor(null)}>← Back to Vendors</Button>
              <div className="flex items-center mb-6">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h2 className="text-2xl font-bold">{selectedVendor.name}</h2>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1">{selectedVendor.rating}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span>{selectedVendor.deliveryTime}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                        <div className="ml-4 flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="font-medium">${product.price.toFixed(2)}</span>
                            <Button size="sm" onClick={() => addToCart(product)}>Add</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      {checkoutStep === 0 ? "Your Cart" : checkoutStep === 1 ? "Delivery Information" : "Order Confirmation"}
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => setIsCartOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="mt-8">
                    {checkoutStep === 0 ? (
                      <>
                        {cart.length === 0 ? (
                          <div className="text-center py-12">
                            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                            <p className="mt-1 text-sm text-gray-500">Add some delicious items!</p>
                          </div>
                        ) : (
                          <div className="flow-root">
                            <ul className="-my-6 divide-y divide-gray-200">
                              {cart.map(item => (
                                <li key={item.id} className="py-6 flex">
                                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                  <div className="ml-4 flex-1 flex flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>{item.name}</h3>
                                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                                    </div>
                                    <div className="flex-1 flex items-end justify-between text-sm">
                                      <div className="flex items-center border rounded-md">
                                        <Button variant="ghost" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                                        <span className="px-2">{item.quantity}</span>
                                        <Button variant="ghost" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                                      </div>
                                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => removeFromCart(item.id)}>Remove</Button>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    ) : checkoutStep === 1 ? (
                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="street">Street Address</Label>
                          <Input id="street" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="123 Main St" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input id="city" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} placeholder="New York" />
                          </div>
                          <div>
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input id="zip" value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} placeholder="10001" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="notes">Delivery Notes</Label>
                          <Textarea id="notes" value={address.notes} onChange={e => setAddress({...address, notes: e.target.value})} placeholder="Any special instructions?" />
                        </div>
                        <div>
                          <Label>Delivery Time</Label>
                          <RadioGroup defaultValue="asap">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="asap" id="asap" />
                              <Label htmlFor="asap">ASAP ({selectedVendor?.deliveryTime})</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="later" id="later" />
                              <Label htmlFor="later">Schedule for later</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                          <Check className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Order Confirmed!</h3>
                        <p className="mt-2 text-sm text-gray-500">Your order has been placed successfully. You'll receive updates shortly.</p>
                        <div className="mt-6 bg-gray-50 rounded-lg p-4 text-left">
                          <h4 className="font-medium text-gray-900">Order Summary</h4>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between"><span>Items:</span><span>${cartTotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Delivery:</span><span>${deliveryFee.toFixed(2)}</span></div>
                            <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2"><span>Total:</span><span>${total.toFixed(2)}</span></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {checkoutStep < 2 && (
                  <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    {checkoutStep === 0 ? (
                      <div className="space-y-4">
                        <div className="flex justify-between text-base font-medium text-gray-
