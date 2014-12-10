class Link < ActiveRecord::Base
  belongs_to :collective
  acts_as_list scope: :collective
  mount_uploader :link_cover, LinkCoverUploader
end
