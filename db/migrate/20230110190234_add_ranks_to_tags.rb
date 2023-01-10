class AddRanksToTags < ActiveRecord::Migration[7.0]
  def change
    add_column :tags, :rank, :integer, default: 0, null: false
  end
end
