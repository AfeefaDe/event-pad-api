Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resources :events, only: [:create, :update, :show] do
    member do
      resources :members, only: [:create, :index]
      resources :messages, only: [:create, :index]
    end
  end
end