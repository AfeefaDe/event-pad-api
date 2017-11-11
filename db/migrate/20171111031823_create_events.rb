class CreateEvents < ActiveRecord::Migration[5.1]

  def change
    create_table :event do |t|
      t.string :title, null: false
      t.datetime :start, null: false
      t.datetime :end, null: false

      t.timestamps
    end
  end

end
