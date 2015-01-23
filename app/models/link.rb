class Link < ActiveRecord::Base
  belongs_to :collective
  belongs_to :node
  acts_as_list scope: :collective
  mount_uploader :link_cover, LinkCoverUploader
end
