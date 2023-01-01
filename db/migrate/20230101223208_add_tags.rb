class AddTags < ActiveRecord::Migration[7.0]
  def change
    create_table :tags do |t|
      t.belongs_to :category, index: true
      t.string :name
      t.boolean :active, default: true
      t.boolean :featured, default: false
      t.timestamps
    end
  end
end
