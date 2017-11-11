class CreateMessages < ActiveRecord::Migration[5.1]
  def change
    create_table :messages do |t|
      t.string :author_name, null: false
      t.text :content, null: false

      t.timestamps
    end
  end
end
