class CreateScripts < ActiveRecord::Migration
  def change
    create_table :scripts do |t|

      t.text :content
      t.string :title
      t.integer :owner_id
      t.timestamps null: false
    end
  end
end
