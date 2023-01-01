# Category is a directory in the inspiration folder
# Tag is a directory in the category folder
# Image is a file in the tag folder
class Category < Base
  attr_reader :name, :tags

  BASE_PATH = "./inspiration"

  def initialize(name)
    @name = name
    path = "#{BASE_PATH}/#{name}"
    @tags = Dir.entries(path)
      .select { |f| File.directory? File.join(path, f) }
      .reject { |f| f == "." || f == ".." }
      .sort
      .map { |tag| Tag.new(tag, name) }
  end

  def self.all
    Dir.entries("./inspiration")
      .select { |f| File.directory? File.join(BASE_PATH, f) }
      .reject { |f| f == "." || f == ".." }
      .sort
      .map { |category| Category.new(category) }
  end

  def self.find(name)
    all.find { |category| category.name == name.to_s }
  end
end
