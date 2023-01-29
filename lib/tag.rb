require "active_support/core_ext/string/inflections"

# Tag is a directory in the category folder
# Image is a file in the tag folder
class Tag < ActiveRecord::Base
  belongs_to :category

  validates :name, presence: true

  scope :active, -> { where(active: true) }
  scope :hidden, -> { where(active: false) }
  scope :featured, -> { where(featured: true) }

  # delete all images in tag folder when tag is deleted
  before_destroy :delete_images

  def images
    # return empty array if path doesn't exist
    return [] unless Dir.exist?(path)
    @images ||= Dir.entries(path)
      .select { |f| File.file? File.join(path, f) }
      .reject { |f| !f.end_with?(".jpg") }
      .sort
      .map { |image| Image.new(image, self) }
  end

  def path
    "./inspiration/#{category.name}/#{name}"
  end

  def hidden
    !active
  end

  def delete_images
    FileUtils.rm_rf(path)
  end

  def tag_name
    name.parameterize
  end
end
