class ChangeLinks < ActiveRecord::Migration
  def change
    change_column :links, :position, :float
  end
end
