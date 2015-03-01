module CollectivesHelper
  def current_user_is_author(collective)
    if user_signed_in? and collective.user and
      collective.user.id == current_user.id
      return true
    end
  end
end
