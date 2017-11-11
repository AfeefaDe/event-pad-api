class MembersController < ApplicationController

  def create
    result = Member::Operation::Create.(params.merge(event_id: params.delete(:id)))

    if result.success?
      render json: Member::Representer::MemberRepresenter.new(result['model']).to_json, status: :created
    else
      render json: 'internal error'
    end
  end

end
