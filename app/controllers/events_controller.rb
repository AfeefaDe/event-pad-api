class EventsController < ApplicationController

  def create
    result = Event::Operation::Create.(params)

    if result.success?
      render json: Event::Representer::EventRepresenter.new(result['model']).to_json, status: :created
    else
      render json: 'internal error'
    end
  end

  def show
    result = Event::Operation::Show.(params)

    if result.success?
      render json: Event::Representer::EventRepresenter.new(result['model']).to_json
    else
      render json: 'internal error'
    end
  end

  def update
    result = Event::Operation::Update.(params)

    if result.success?
      render json: Event::Representer::EventRepresenter.new(result['model']).to_json
    else
      render json: 'internal error'
    end
  end

end
