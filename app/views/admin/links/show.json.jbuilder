json.extract! @link, :id, :url, :title, :collective_id, :position, :summary, :node_id
json.link_cover_thumb @link.link_cover.thumb.url
json.link_cover_url @link.link_cover.url
