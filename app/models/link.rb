class Link < ActiveRecord::Base
  belongs_to :collective
  belongs_to :node
  mount_uploader :link_cover, LinkCoverUploader
end
