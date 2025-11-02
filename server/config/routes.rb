# server/config/routes.rb
Rails.application.routes.draw do
  get "/items/notifications", to: "items#notifications"
  resources :items
  resources :shoppinglist, controller: "shopping_list"
  get "/items/barcode/:code", to: "items#search_barcode"
end
