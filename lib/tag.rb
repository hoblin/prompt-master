require 'active_support/core_ext/string/inflections'

# Tag is a directory in the category folder
# Image is a file in the tag folder
class Tag < Base
  attr_reader :name, :path, :images

  def initialize(name, category)
    @name = name
    @path = "./inspiration/#{category}/#{name}"
    # collect images from the tag folder
    @images = Dir.entries(path)
      .select { |f| File.file? File.join(path, f) }
      .sort
      .map { |image| Image.new(image, name, category) }
  end

  def tag_name
    name.parameterize
  end
end
