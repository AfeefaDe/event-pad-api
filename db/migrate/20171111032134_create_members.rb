class CreateMembers < ActiveRecord::Migration[5.1]

  def change
    create_table :members do |t|
      t.string :name, null: false

      t.references :event

      t.timestamps
    end

  end
end
