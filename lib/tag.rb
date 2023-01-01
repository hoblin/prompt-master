require "active_support/core_ext/string/inflections"

# Tag is a directory in the category folder
# Image is a file in the tag folder
class Tag < ActiveRecord::Base
  belongs_to :category

  validates :name, presence: true

  def images
    @images ||= Dir.entries(path)
      .select { |f| File.file? File.join(path, f) }
      .sort
      .map { |image| Image.new(image, self) }
  end

  def path
    "./inspiration/#{category.name}/#{name}"
  end

  def tag_name
    name.parameterize
  end
end