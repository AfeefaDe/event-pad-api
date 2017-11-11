class AddUuidToEvents < ActiveRecord::Migration[5.1]

  def change
    add_column :events, :uuid, :string, null: false
  end

end
