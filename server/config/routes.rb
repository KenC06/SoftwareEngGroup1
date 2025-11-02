# server/config/routes.rb
Rails.application.routes.draw do
  get "/items/low_stock", to: "items#low_stock"
  get "/items/expiring_soon", to: "items#expiring_soon"
  get "/items/barcode/:code", to: "items#search_barcode"
  resources :items
  resources :shoppinglist, controller: "shopping_list"
end
