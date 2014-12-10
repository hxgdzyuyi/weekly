class AddLinkCoverToLinks < ActiveRecord::Migration
  def change
    add_column :links, :link_cover, :string
  end
end
